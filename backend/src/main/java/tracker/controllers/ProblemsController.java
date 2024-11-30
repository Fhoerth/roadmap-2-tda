package tracker.controllers;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tracker.models.Problem;
import tracker.repositories.ProblemRepository;

@RestController
@RequestMapping("/api/problems")
public class ProblemsController {
  @Autowired
  private ProblemRepository problemRepository;

  @GetMapping
  public List<Problem> getAllCategories() {
    return problemRepository.findAll();
  }
}
