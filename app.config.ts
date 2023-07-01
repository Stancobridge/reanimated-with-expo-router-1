import { ExpoConfig } from "expo/config";

const config: ExpoConfig = {
  name: "my-app",
  slug: "my-app",
  scheme: "my-app",
  web: {
    bundler: "metro",
  },
};

export default config;
