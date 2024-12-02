package tracker.serialization;

import com.fasterxml.jackson.core.JsonProcessingException;
import tracker.models.User;

public class UserDeserializer {
  public static User deserialize(String stringifiedUser) throws JsonProcessingException {
    return UserObjectMapper.getMapper().readValue(stringifiedUser, User.class);
  }
}
