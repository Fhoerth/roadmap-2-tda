package tracker.services.db;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tracker.DTO.UserDTO;
import tracker.DTO.UserInputDTO;
import tracker.exceptions.InvalidUserException;
import tracker.exceptions.UserNotFoundException;
import tracker.mappers.UserMapper;
import tracker.models.User;
import tracker.repositories.UserRepository;

@Service
public class UserService {
  private UserRepository userRepository;

  @Autowired
  public UserService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  public List<UserDTO> getAllUsers() {
    return UserMapper.toDTOList(userRepository.findAll());
  }

  public UserDTO createUser(UserInputDTO input) {
    User user = new User(input.lu(), input.nickname(), input.pin());

    userRepository.save(user);

    return new UserDTO(user.getId(), user.getNickname());
  }

  public boolean isValidUser(User userToBeValidated) throws UserNotFoundException, InvalidUserException {
    Optional<User> maybeUser = userRepository.findById(userToBeValidated.getId());

    if (maybeUser.isEmpty()) {
      throw new UserNotFoundException("User not found.");
    }

    User user = maybeUser.get();

    if (user.equals(userToBeValidated) && user.hashCode() == userToBeValidated.hashCode())
      return true;

    throw new InvalidUserException("Invalid User.");
  }
}
