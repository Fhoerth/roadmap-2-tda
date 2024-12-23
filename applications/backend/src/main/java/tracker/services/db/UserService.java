package tracker.services.db;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tracker.DTO.UserDTO;
import tracker.DTO.UserInputDTO;
import tracker.DTO.UserLoginDTO;
import tracker.exceptions.InvalidUserException;
import tracker.exceptions.UserNotFoundException;
import tracker.exceptions.UserNotUniqueException;
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

  public User getUser(UserLoginDTO input) throws UserNotFoundException {
    User user = userRepository.getByLuAndPin(input.lu(), input.pin());

    if (user == null)
      throw new UserNotFoundException("User Not Found");

    return user;
  }

  public User createUser(UserInputDTO input) throws UserNotUniqueException {
    Boolean existsByLu = userRepository.existsByLu(input.lu());
    Boolean existsByNickname = userRepository.existsByNickname(input.nickname());
    Boolean existsByLeetCodeUsernName = userRepository.existsByLeetCodeUsername(input.leetCodeUserName());

    if (existsByLu)
      throw new UserNotUniqueException("LU not unique.");
    else if (existsByNickname)
      throw new UserNotUniqueException("Nickname not unique.");
    else if (existsByLeetCodeUsernName)
      throw new UserNotUniqueException("LeetCode userName not unique.");

    User user = new User(input.lu(), input.nickname(), input.leetCodeUserName(), input.pin());

    userRepository.save(user);

    return user;
  }

  public boolean isValidUser(User userToBeValidated) throws UserNotFoundException, InvalidUserException {
    Optional<User> maybeUser = userRepository.findById(userToBeValidated.getId());

    if (maybeUser.isEmpty())
      throw new UserNotFoundException("User Not Found.");

    User user = maybeUser.get();

    if (user.equals(userToBeValidated) && user.hashCode() == userToBeValidated.hashCode())
      return true;

    throw new InvalidUserException("Invalid User.");
  }
}
