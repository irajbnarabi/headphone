package ir.headphone.rest.controller;

import ir.headphone.rest.logger.Logger;
import ir.headphone.rest.service.impl.FileStorageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.Objects;

@RestController
@RequestMapping("/api/v1/admin/files")
public class FileController extends AbstractController {
    private final FileStorageService fileStorageService;
    private final org.apache.logging.log4j.Logger logger = Logger.getInstance();
    private final String cdnBasePath;

    public FileController(FileStorageService fileStorageService,
                          @Value("${rest.cdn.basePath}") String cdnBasePath) {
        this.fileStorageService = fileStorageService;
        this.cdnBasePath = cdnBasePath;
    }

    @PostMapping("/upload")
    public Object handleUpload(@RequestParam("file") MultipartFile file) throws IOException {
        String fileName = fileStorageService.storeFile(file.getInputStream(), Objects.requireNonNull(file.getOriginalFilename()));

//        String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
//                .path("/downloadFile/")
//                .path(fileName)
//                .toUriString();
//
//        return new UploadFileResponse(fileName, fileDownloadUri, file.getContentType(), file.getSize());
        return cdnBasePath + fileName;
    }

    @GetMapping("/download/{fileName:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName, HttpServletRequest request) {
        Resource resource = fileStorageService.loadFileAsResource(fileName);

        String contentType = null;
        try {
            contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
        } catch (IOException ex) {
            logger.info("Could not determine file type.");
        }

        if (contentType == null) {
            contentType = "application/octet-stream";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .header(HttpHeaders.CACHE_CONTROL, "max-age=604800")
                .body(resource);
    }
}
