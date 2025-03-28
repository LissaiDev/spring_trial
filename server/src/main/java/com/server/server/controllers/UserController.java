package com.server.server.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.server.server.model.User;
import com.server.server.services.UserService;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/users")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(
        UserController.class
    );

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Autowired
    private UserService service;

    @Autowired
    private ObjectMapper objectMapper; // Adicione esta linha

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

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public User create(
        @RequestPart(value = "user") String userStr,
        @RequestPart(value = "photo") MultipartFile photo
    ) {
        try {
            logger.info("Recebendo requisição com userStr: " + userStr);
            logger.info("Nome do arquivo: " + photo.getOriginalFilename());

            objectMapper.registerModule(new JavaTimeModule());
            User user = objectMapper.readValue(userStr, User.class);

            String fileName =
                System.currentTimeMillis() + "_" + photo.getOriginalFilename();
            String photoPath = uploadDir + "/" + fileName;

            Files.copy(
                photo.getInputStream(),
                Paths.get(photoPath),
                StandardCopyOption.REPLACE_EXISTING
            );

            user.setPhotoUrl("/uploads/" + fileName);
            return service.save(user);
        } catch (Exception e) {
            logger.error("Erro ao processar requisição: ", e);
            throw new RuntimeException("Erro ao processar requisição", e);
        }
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<User> update(
        @PathVariable Long id,
        @RequestPart(value = "user", required = true) String userStr,
        @RequestPart(value = "photo", required = false) MultipartFile photo
    ) {
        try {
            objectMapper.registerModule(new JavaTimeModule());
            User updatedUser = objectMapper.readValue(userStr, User.class);

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

                    // Se uma nova foto foi enviada
                    if (photo != null && !photo.isEmpty()) {
                        try {
                            String fileName =
                                System.currentTimeMillis() +
                                "_" +
                                photo.getOriginalFilename();
                            String photoPath = uploadDir + "/" + fileName;

                            Files.copy(
                                photo.getInputStream(),
                                Paths.get(photoPath),
                                StandardCopyOption.REPLACE_EXISTING
                            );

                            user.setPhotoUrl("/uploads/" + fileName);
                        } catch (IOException e) {
                            throw new RuntimeException(
                                "Erro ao salvar a foto",
                                e
                            );
                        }
                    }

                    return ResponseEntity.ok(service.save(user));
                })
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            logger.error("Erro ao processar atualização: ", e);
            return ResponseEntity.badRequest().build();
        }
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
