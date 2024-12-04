package tracker.controllers;

import jakarta.validation.constraints.Pattern;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import tracker.DTO.StatusDTO;

@Validated
@RestController
@RequestMapping("/api/leet-code")
public class LeetCodeController {
  @GetMapping("/submission/{submissionId}/status")
  public StatusDTO getProblemStatus(
      @PathVariable @Pattern(regexp = "\\d+", message = "Problem ID must be numeric") String submissionId) {
    return new StatusDTO("OK");
  }
}
