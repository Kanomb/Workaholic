package com.yahir.Workaholic.UploadResume.UploadService;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {
    
    public void init();

    public void save(MultipartFile file, String email);

    /* public Resource load(String filename); */

    /* public void deleteAll();

    public Stream<Path> loadAll(); */
    
}