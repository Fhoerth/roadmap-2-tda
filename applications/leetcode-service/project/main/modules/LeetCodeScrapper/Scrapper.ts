import { SingleTaskProcessor } from '../SingleTaskProcessor';
import { Browser } from './Browser';
import { CookieService } from './CookieService';
import { processService } from './ProcessService';
import { BrowserTasks } from './tasks/BrowserTasks';
import { LeetCodeTasks } from './tasks/LeetCodeTasks';
import { LoginTasks } from './tasks/LoginTasks';
import type { Submission } from './types/Submission';
import type { SubmissionId } from './types/SubmissionId';

class Scrapper {
  #browser: Browser;
  #cookieService: CookieService;
  #taskProcessor: SingleTaskProcessor<void | Submission>;

  #processService: typeof processService;
  #browserTasks: BrowserTasks;
  #loginTasks: LoginTasks;
  #leetCodeTasks: LeetCodeTasks;

  constructor() {
    this.#browser = new Browser();
    this.#cookieService = new CookieService(this.#browser);
    this.#taskProcessor = new SingleTaskProcessor<void | Submission>();

    this.#processService = processService;
    this.#browserTasks = new BrowserTasks(this.#browser);
    this.#loginTasks = new LoginTasks(
      this.#browser,
      this.#taskProcessor,
      this.#processService,
      this.#browserTasks,
      this.#cookieService,
    );
    this.#leetCodeTasks = new LeetCodeTasks(
      this.#browser,
      this.#taskProcessor,
      this.#processService,
      this.#browserTasks,
      this.#loginTasks,
    );

    this.#browser.launch(this.#onBrowserLaunch.bind(this));
  }

  async #onBrowserLaunch(): Promise<void> {
    this.#cookieService.loadCookies();
    // Initialize login.
    await this.fetchSubmission('1407780531');
  }

  public async halt(): Promise<void> {
    return this.#browser.halt();
  }

  public async fetchSubmission(
    submissionId: SubmissionId,
  ): Promise<Submission> {
    return this.#leetCodeTasks.enqueueFetchSumissionTask(submissionId);
  }
}

export { Scrapper };
