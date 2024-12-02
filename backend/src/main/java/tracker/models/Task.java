package tracker.models;

public class Task {
  private Integer id;
  private String name;
  private String difficulty;
  private String url;

  public Task(Integer id, String name, String difficulty, String url) {
    this.id = id;
    this.name = name;
    this.difficulty = difficulty;
    this.url = url;
  }

  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getDifficulty() {
    return difficulty;
  }

  public void setDifficulty(String difficulty) {
    this.difficulty = difficulty;
  }

  public String getUrl() {
    return url;
  }

  public void setUrl(String url) {
    this.url = url;
  }
}
