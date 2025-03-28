package com.server.server.controllers;

import com.server.server.model.User;
import com.server.server.service.UserService;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/users")
public class UserController {

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Autowired
    private UserService service;

    @GetMapping
    public List<User> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getById(@PathVariable Long id) {
        return service
            .getById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public User create(
        @RequestPart("user") User user,
        @RequestPart("photo") MultipartFile photo
    ) {
        try {
            String fileName =
                System.currentTimeMillis() + "_" + photo.getOriginalFilename();
            String photoPath = uploadDir + "/" + fileName;

            validateFile(photo);

            Files.copy(
                photo.getInputStream(),
                Paths.get(photoPath),
                StandardCopyOption.REPLACE_EXISTING
            );

            user.setPhotoUrl("/uploads/" + fileName);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao salvar arquivo", e);
        }
        return service.save(user);
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> update(
        @PathVariable Long id,
        @RequestBody User updatedUser
    ) {
        return service
            .getById(id)
            .map(user -> {
                user.setName(updatedUser.getName());
                user.setNickname(updatedUser.getNickname());
                user.setBirthDate(updatedUser.getBirthDate());
                user.setCountry(updatedUser.getCountry());
                user.setProvince(updatedUser.getProvince());
                user.setNeighborhood(updatedUser.getNeighborhood());
                user.setEmail(updatedUser.getEmail());
                return ResponseEntity.ok(service.save(user));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Arquivo vazio");
        }

        if (file.getSize() > 5_000_000) {
            throw new IllegalArgumentException("Arquivo muito grande");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("Tipo de arquivo não permitido");
        }
    }
}
