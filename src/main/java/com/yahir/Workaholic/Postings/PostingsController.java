package com.yahir.Workaholic.Postings;

import java.lang.reflect.Array;
import java.sql.Date;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.yahir.Workaholic.Currencies.Currency;
import com.yahir.Workaholic.Currencies.CurrencyRepository;
import com.yahir.Workaholic.JobTypes.JobType;
import com.yahir.Workaholic.JobTypes.JobTypeRepository;
import com.yahir.Workaholic.Rates.Rate;
import com.yahir.Workaholic.Rates.RateRepository;
import com.yahir.Workaholic.Users.User;
import com.yahir.Workaholic.Users.UserRepository;

@RestController
@RequestMapping("api/v1/postings/")
@CrossOrigin
public class PostingsController {

    private final PostingsRepository repository;
    private final UserRepository userRepository;
    private final CurrencyRepository currencyRepository;
    private final JobTypeRepository jobTypeRepository;
    private final RateRepository rateRepository;

    public PostingsController(PostingsRepository repository, UserRepository userRepository,
            CurrencyRepository currencyRepository, JobTypeRepository jobTypeRepository, RateRepository rateRepository) {
        this.repository = repository;
        this.userRepository = userRepository;
        this.currencyRepository = currencyRepository;
        this.jobTypeRepository = jobTypeRepository;
        this.rateRepository = rateRepository;
    }

    record newPostingRequest(
            Number userId,
            String title,
            String description,
            String[] jobType,
            Number salary,
            String salaryCurrency,
            String salaryRate,
            Number duration,
            String date,
            String benefits
            ) {}

    @PostMapping("/add")
    public Object addJobPosting(@RequestBody newPostingRequest request) {
        Postings Posting = new Postings();
        User user = userRepository.findUserById(request.userId());
        Currency currency = currencyRepository.findCurrencyByCode(request.salaryCurrency());
        Rate rate = rateRepository.findRateByRateName(request.salaryRate());
/*         Set<JobType> jobTypes = jobTypeRepository.findAllByType(request.jobType()); */
        Posting.setJobTypes(findJobTypes(request.jobType()));
        Posting.setTitle(request.title());
        Posting.setDescription(request.description());
        Posting.setSalary(request.salary());
        Posting.setCurrency(currency);
        Posting.setRate(rate);
        Posting.setDuration(request.duration());
        Posting.setDate(request.date());
        Posting.setBenefits(request.benefits());
        Posting.setUser(user);
        repository.save(Posting);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    public Set<JobType> findJobTypes(String[] array) {
        Set<JobType> ArrayOfTypes = new HashSet<JobType>(); 
        switch (array.length) {
            case 1:
                JobType jobType1 = jobTypeRepository.findByType(array[0]);
                ArrayOfTypes.add(jobType1);
                break;
            case 2:
                JobType jobType2 = jobTypeRepository.findByType(array[0]);
                ArrayOfTypes.add(jobType2);
                JobType jobType3 = jobTypeRepository.findByType(array[1]);
                ArrayOfTypes.add(jobType3);
                break;
            case 3:
                JobType jobType4 = jobTypeRepository.findByType(array[0]);
                ArrayOfTypes.add(jobType4);
                JobType jobType5 = jobTypeRepository.findByType(array[1]);
                ArrayOfTypes.add(jobType5);
                JobType jobType6 = jobTypeRepository.findByType(array[2]);
                ArrayOfTypes.add(jobType6);
                break;
            default:
                break;
        }
        return ArrayOfTypes;
    }

    @GetMapping("/{id}")
    public Object showJobPostPerId(@PathVariable Number id) {
        Postings post = repository.findPostingsById(id);
        if (post == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return post;
    }

    @GetMapping("all")
    public List<Postings> showAll() {
        return repository.findAll();
    }

    @GetMapping("/user/{id}")
    public Object showPostingsByUserId(@PathVariable Number id) {
        User user = userRepository.findUserById(id);
        List<Postings> posts = repository.findAllPostingsByUser(user);
        if(posts.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return repository.findAllPostingsByUser(user);
    }

    record newPostDeleteRequest(
        Integer post_id,
        User company
    ){}

    @PostMapping("/delete/")
    public Object deletePost(@RequestBody newPostDeleteRequest request) {
        Postings deletePost = repository.findPostingsById(request.post_id());
        if(deletePost.getUser().equals(request.company())) {
            repository.delete(deletePost);
            return new ResponseEntity<>(HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
}
