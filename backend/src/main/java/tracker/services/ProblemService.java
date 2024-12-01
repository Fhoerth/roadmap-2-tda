package tracker.services;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tracker.dto.ProblemDTO;
import tracker.mappers.ProblemMapper;
import tracker.repositories.ProblemRepository;

@Service
public class ProblemService {
  @Autowired
  private ProblemRepository problemRepository;

  public List<ProblemDTO> getAllProblems() {
    return ProblemMapper.toDTOList(problemRepository.findAll());
  }
}