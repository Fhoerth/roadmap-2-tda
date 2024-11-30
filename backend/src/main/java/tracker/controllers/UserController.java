package tracker.controllers;

import java.util.ArrayList;
import java.util.List;
import org.springframework.web.bind.annotation.*;
import tracker.models.User;

@RestController
@RequestMapping("/api/users")
public class UserController {
  private List<User> users = new ArrayList<>();

  @GetMapping
  public List<User> getAllUsers() {
    User user1 = new User("123", "nickname", 1234);
    users.add(user1);
    return users;
  }

  @PostMapping
  public User createUser(@RequestBody User user) {
    users.add(user);
    return user;
  }
}
