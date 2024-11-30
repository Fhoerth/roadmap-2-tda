package tracker.models;

import java.util.List;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "problems")
public class Problem {
  @Id
  private ObjectId id; // MongoDB will generate this automatically

  private Integer level;
  private String name;
  private List<Task> tasks;

  public Problem(Integer level, String name, List<Task> tasks) {
    this.level = level;
    this.name = name;
    this.tasks = tasks;
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

  public List<Task> getTasks() {
    return tasks;
  }

  public void setTasks(List<Task> tasks) {
    this.tasks = tasks;
  }

  @Override
  public String toString() {
    return "Problem{" + "id=" + id + ", name='" + name + '\'' + ", tasks=" + tasks + '}';
  }
}
