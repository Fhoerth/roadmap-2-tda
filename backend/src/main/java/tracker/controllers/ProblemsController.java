package tracker.controllers;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import tracker.DTO.ProblemDTO;
import tracker.services.ProblemService;

@RestController
@RequestMapping("/api/problems")
public class ProblemsController {
  private ProblemService problemService;

  @Autowired
  public ProblemsController(ProblemService problemService) {
    this.problemService = problemService;
  }

  @GetMapping
  public List<ProblemDTO> getAllProblems() {
    return problemService.getAllProblems();
  }
}
