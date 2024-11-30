package tracker.models;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "scripts")
public class Script {
  @Id
  private ObjectId id;

  private String scriptId;
  private String name;
  private boolean executed;

  public Script(String scriptId, String name, boolean executed) {
    this.scriptId = scriptId;
    this.name = name;
    this.executed = executed;
  }

  public ObjectId getId() {
    return id;
  }

  public void setId(ObjectId id) {
    this.id = id;
  }

  public String getScriptId() {
    return scriptId;
  }

  public void setScriptId(String scriptId) {
    this.scriptId = scriptId;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public boolean isExecuted() {
    return executed;
  }

  public void setExecuted(boolean executed) {
    this.executed = executed;
  }
}
