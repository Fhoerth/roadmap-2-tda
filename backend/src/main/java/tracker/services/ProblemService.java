package tracker.services;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import tracker.DTO.ProblemDTO;
import tracker.mappers.ProblemMapper;
import tracker.repositories.ProblemRepository;

@Service
public class ProblemService {
  private ProblemRepository problemRepository;

  @Autowired
  public ProblemService(ProblemRepository problemRepository) {
    this.problemRepository = problemRepository;
  }

  public List<ProblemDTO> getAllProblems() {
    return ProblemMapper.toDTOList(problemRepository.findAll());
  }
}
