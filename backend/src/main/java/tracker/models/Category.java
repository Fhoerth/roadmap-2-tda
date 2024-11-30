package tracker.models;

import java.util.List;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "problems")
public class Category {
  @Id
  private ObjectId id; // MongoDB will generate this automatically

  private Integer level;
  private String name;
  private List<Problem> problems;

  public Category(Integer level, String name, List<Problem> problems) {
    this.level = level;
    this.name = name;
    this.problems = problems;
  }

  public ObjectId getId() {
    return id;
  }

  public void setId(ObjectId id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Integer getLevel() {
    return level;
  }

  public Integer setLevel(Integer level) {
    return this.level = level;
  }

  public List<Problem> getProblems() {
    return problems;
  }

  public void setProblems(List<Problem> problems) {
    this.problems = problems;
  }

  @Override
  public String toString() {
    return "Category{" + "id=" + id + ", name='" + name + '\'' + ", problems=" + problems + '}';
  }
}
