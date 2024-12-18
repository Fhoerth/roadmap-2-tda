package tracker.models;

import lombok.Data;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "problems")
@Data
public class Problem {
  @Id
  private ObjectId id;

  private ObjectId levelId;
  private Integer leetCodeProblemId;
  private String name;
  private String difficulty;
  private String url;
  private String editCodeUrl;
  private String slug;

  public Problem(ObjectId levelId, Integer leetCodeProblemId, String name, String difficulty, String url,
      String editCodeUrl, String slug) {
    this.levelId = levelId;
    this.leetCodeProblemId = leetCodeProblemId;
    this.name = name;
    this.difficulty = difficulty;
    this.url = url;
    this.editCodeUrl = editCodeUrl;
    this.slug = slug;
  }
}
