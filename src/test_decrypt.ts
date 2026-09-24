import { parse, commaSeparatedList } from "./lib/cmdline";
import { test_init } from "./lib/helpers";

import { decryptDevice } from "./checks/decryption";
import { logIn } from "./checks/login";
import { ProductStrategyFactory } from "./lib/product_strategy_factory";

const options = parse((cmd) =>
  cmd
    .option("--install", "Proceed to install the system (the default is not to install it)")
    .option("--decrypt-password <password>", "Password to decrypt an existing encrypted partition")
    .option(
      "--destructive-actions <actions>...",
      "Comma-separated list of actions (excluding 'Delete ')",
      commaSeparatedList,
    ),
);

test_init(options);

const testStrategy = ProductStrategyFactory.create(
  options.productVersion,
  options.agamaWebUiPackageVersion,
);

logIn(options.password);
decryptDevice(options.decryptPassword);
testStrategy.verifyDecryptDestructiveActions(options.destructiveActions);
if (options.install) {
  testStrategy.performInstallation();
  testStrategy.finishInstallation();
}
