import { SingleTaskProcessor } from '../SingleTaskProcessor';
import { CookieService } from './CookieService';
import { ForeverBrowser } from './ForeverBrowser';
import { processService } from './ProcessService';
import { BrowserTasks } from './tasks/BrowserTasks';
import { LeetCodeTasks } from './tasks/LeetCodeTasks';
import { LoginTasks } from './tasks/LoginTasks';
import type { Submission } from './types/Submission';
import type { SubmissionId } from './types/SubmissionId';

class Scrapper {
  #foreverBrowser: ForeverBrowser;
  #cookieService: CookieService;
  #taskProcessor: SingleTaskProcessor<void | Submission>;

  #processService: typeof processService;
  #browserTasks: BrowserTasks;
  #loginTasks: LoginTasks;
  #leetCodeTasks: LeetCodeTasks;

  constructor() {
    this.#foreverBrowser = new ForeverBrowser();
    this.#cookieService = new CookieService(this.#foreverBrowser);
    this.#taskProcessor = new SingleTaskProcessor<void | Submission>();

    this.#processService = processService;
    this.#browserTasks = new BrowserTasks(this.#foreverBrowser);
    this.#loginTasks = new LoginTasks(
      this.#foreverBrowser,
      this.#taskProcessor,
      this.#processService,
      this.#browserTasks,
      this.#cookieService,
    );
    this.#leetCodeTasks = new LeetCodeTasks(
      this.#foreverBrowser,
      this.#taskProcessor,
      this.#processService,
      this.#loginTasks,
    );

    this.#foreverBrowser.launchForever(this.#onBrowserLaunch.bind(this));
  }

  async #onBrowserLaunch(): Promise<void> {
    this.#cookieService.loadCookies();
    // Initialize login.
    await this.fetchSubmission('1407780531');
  }

  public async halt(): Promise<void> {
    return this.#foreverBrowser.halt();
  }

  public async fetchSubmission(
    submissionId: SubmissionId,
  ): Promise<Submission> {
    return this.#leetCodeTasks.enqueueFetchSumissionTask(submissionId);
  }
}

export { Scrapper };
