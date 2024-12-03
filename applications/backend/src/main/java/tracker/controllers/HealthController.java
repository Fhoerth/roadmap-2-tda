package tracker.controllers;

import org.springframework.web.bind.annotation.*;
import tracker.DTO.StatusDTO;

@RestController
@RequestMapping("/api/health")
public class HealthController {

  @GetMapping
  public StatusDTO get() {
    return new StatusDTO("OK");
  }
}
