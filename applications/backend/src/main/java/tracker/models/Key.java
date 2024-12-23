package tracker.models;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.NoArgsConstructor;

@NoArgsConstructor
@Document(collection = "keys")
public class Key {
  @Id
  private ObjectId id;

  private String base64Key;

  public Key(String base64Key) {
    this.base64Key = base64Key;
  }

  public ObjectId getId() {
    return id;
  }

  public String getBase64Key() {
    return base64Key;
  }
}
