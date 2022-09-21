package ir.headphone.rest.service.impl;

import ir.headphone.rest.error.FileStorageError;
import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
public class FileStorageService {

    private final Path fileStorageLocation;
    private final String cdnBasePath;

    @Autowired
    public FileStorageService(@Value("${rest.storage.path}") String storagePath,
                              @Value("${rest.cdn.basePath}") String cdnBasePath) {
        this.fileStorageLocation = Paths.get(storagePath).toAbsolutePath().normalize();
        if (cdnBasePath.endsWith("/")) {
            cdnBasePath = cdnBasePath.substring(0, cdnBasePath.length() - 1);
        }
        this.cdnBasePath = cdnBasePath;

        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new FileStorageError(ex.getMessage());
        }
    }

    public String prepareImages(String filePath) {
        if (filePath == null) {
            return null;
        }
        return cdnBasePath + "/" + filePath.substring(filePath.lastIndexOf("/") + 1);
    }

    public String storeFile(InputStream file, String fn) {
        String fileName = DigestUtils.md5Hex(fn + System.currentTimeMillis() + RandomStringUtils.random(5));
        fileName += fn.substring(fn.lastIndexOf('.'));
        try {
            if (fileName.contains("..")) {
                throw new FileStorageError("Sorry! Filename contains invalid path sequence " + fileName);
            }

            Path targetLocation = this.fileStorageLocation.resolve(fileName);
            Files.copy(file, targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return fileName;
        } catch (IOException ex) {
            throw new FileStorageError(ex.getMessage());
        }
    }

    public Resource loadFileAsResource(String fileName) {
        try {
            Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists()) {
                return resource;
            } else {
                throw new FileStorageError("File not found " + fileName);
            }
        } catch (MalformedURLException ex) {
            throw new FileStorageError("File not found " + fileName);
        }
    }
}
