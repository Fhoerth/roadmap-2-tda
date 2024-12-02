package tracker.token;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Component;
import tracker.models.User;
import tracker.serialization.ObjectIdDeserializer;
import tracker.serialization.ObjectIdSerializer;

@Component
public class TokenSerializer {
  private static class TokenObjectDeserializer {
    public static Token deserialize(ObjectMapper mapper, String stringifiedToken) throws JsonProcessingException {
      return mapper.readValue(stringifiedToken, Token.class);
    }
  }

  private static class TokenObjectSerializer {
    public static String serialize(ObjectMapper mapper, Token token) throws JsonProcessingException {
      return mapper.writeValueAsString(token);
    }
  }

  private static ObjectMapper createMapper() {
    ObjectMapper mapper = new ObjectMapper();
    SimpleModule module = new SimpleModule();

    module.addDeserializer(ObjectId.class, new ObjectIdDeserializer());
    module.addSerializer(ObjectId.class, new ObjectIdSerializer());

    mapper.registerModule(module);

    return mapper;
  }

  private ObjectMapper mapper;

  public TokenSerializer() {
    this.mapper = createMapper();
  }

  public String serialize(User user) throws JsonProcessingException {
    Token token = new Token(user);
    return TokenObjectSerializer.serialize(mapper, token);
  }

  public Token deserialize(String stringifiedToken) throws JsonProcessingException {
    return TokenObjectDeserializer.deserialize(mapper, stringifiedToken);
  }
}
