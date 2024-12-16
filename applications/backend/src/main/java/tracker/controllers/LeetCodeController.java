package tracker.controllers;

import jakarta.validation.constraints.Pattern;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import tracker.DTO.SubmissionDTO;
import tracker.auth.Auth;
import tracker.exceptions.LeetCodeServiceForwardedException;
import tracker.exceptions.LeetCodeServiceRequestException;
import tracker.exceptions.LeetCodeServiceResponseException;
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
      throws LeetCodeServiceForwardedException, LeetCodeServiceRequestException, LeetCodeServiceResponseException {
    return leetCodeService.fetchSubmission(submissionId);
  }

  @Auth
  @GetMapping("/mark-as-solved/{problemSlug}")
  public SubmissionDTO markAsSolved(
      @PathVariable @Pattern(regexp = "^[a-zA-Z0-9-]+$", message = "Problem SLUG must be a valid alphanumeric string.") String problemSlug)
      throws LeetCodeServiceForwardedException, LeetCodeServiceRequestException, LeetCodeServiceResponseException {
    return null;
  }
}
