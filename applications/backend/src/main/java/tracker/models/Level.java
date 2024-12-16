package tracker.models;

import lombok.Data;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "levels")
@Data
public class Level {
  @Id
  private ObjectId id;

  private String name;
  private Integer level;

  public Level(String name, Integer level) {
    this.name = name;
    this.level = level;
  }
}
