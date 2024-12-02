package tracker.serialization;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;
import org.bson.types.ObjectId;

public class UserObjectMapper {
  public static ObjectMapper getMapper() {
    ObjectMapper mapper = new ObjectMapper();
    SimpleModule module = new SimpleModule();

    module.addDeserializer(ObjectId.class, new ObjectIdDeserializer());
    module.addSerializer(ObjectId.class, new ObjectIdSerializer());

    mapper.registerModule(module);

    return mapper;
  }
}
