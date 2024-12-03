package tracker.controllers;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tracker.DTO.UserDTO;
import tracker.services.db.UserService;

@RestController
@RequestMapping("/api/users")
public class UsersController {
  private UserService userService;

  @Autowired
  public UsersController(UserService userService) {
    this.userService = userService;
  }

  @GetMapping
  public List<UserDTO> get() {
    return userService.getAllUsers();
  }
}
