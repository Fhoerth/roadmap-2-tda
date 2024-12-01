package tracker.controllers;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tracker.dto.ProblemDTO;
import tracker.services.ProblemService;

@RestController
@RequestMapping("/api/problems")
public class ProblemsController {
  @Autowired
  private ProblemService problemService;

  @GetMapping
  public List<ProblemDTO> getAllProblems() {
    return problemService.getAllProblems();
  }
}
