package tracker.controllers;

import jakarta.validation.constraints.Pattern;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import tracker.DTO.SubmissionDTO;
import tracker.auth.Auth;
import tracker.exceptions.SubmissionRequestException;
import tracker.services.LeetCodeService;

@Validated
@RestController
@RequestMapping("/api/leet-code")
public class LeetCodeController {
  private LeetCodeService leetCodeService;

  @Autowired
  public LeetCodeController(LeetCodeService leetCodeService) {
    this.leetCodeService = leetCodeService;
  }

  @Auth
  @GetMapping("/submission/{submissionId}")
  public SubmissionDTO getProblemStatus(
      @PathVariable @Pattern(regexp = "\\d+", message = "Problem ID must be numeric") String submissionId)
      throws SubmissionRequestException {
    return leetCodeService.fetchSubmission(submissionId);
  }
}
