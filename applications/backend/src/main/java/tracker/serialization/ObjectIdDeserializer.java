package tracker.serialization;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;
import java.io.IOException;
import org.bson.types.ObjectId;

public class ObjectIdDeserializer extends StdDeserializer<ObjectId> {
  public ObjectIdDeserializer() {
    super(ObjectId.class);
  }

  @Override
  public ObjectId deserialize(JsonParser parser, DeserializationContext context) throws IOException {
    return new ObjectId(parser.getValueAsString());
  }
}
