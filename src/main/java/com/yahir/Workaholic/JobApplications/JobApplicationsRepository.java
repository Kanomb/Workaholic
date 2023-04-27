package com.yahir.Workaholic.JobApplications;

import org.springframework.data.jpa.repository.JpaRepository;

public interface JobApplicationsRepository extends JpaRepository<JobApplications, Integer>{
    
    Boolean existsByUser_id(Number id);

    Boolean existsByUser_idAndPosting_id(Number user_id, Number posting_id);
}
