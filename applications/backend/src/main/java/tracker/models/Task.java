package tracker.models;

public class Task {
  private Integer id;
  private String name;
  private String difficulty;
  private String url;
  private String editCodeUrl;
  private String slug;

  public Task(Integer id, String name, String difficulty, String url, String editCodeUrl, String slug) {
    this.id = id;
    this.name = name;
    this.difficulty = difficulty;
    this.url = url;
    this.editCodeUrl = editCodeUrl;
    this.slug = slug;
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

  public String getEditCodeUrl() {
    return editCodeUrl;
  }

  public void setEditCodeUrl(String editCodeUrl) {
    this.editCodeUrl = editCodeUrl;
  }

  public String getSlug() {
    return slug;
  }

  public void setSlug(String slug) {
    this.slug = slug;
  }
}
