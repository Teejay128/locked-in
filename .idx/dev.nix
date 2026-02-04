{ pkgs, ... }: {
  channel = "stable-24.05"; # or "unstable"

  # The Nix packages to make available
  packages = [
    pkgs.nodejs_20
  ];
  # Sets environment variables in the workspace
  env = {};
  idx = {
    # Search for the extensions you want on https://open-vsx.org/ and use "publisher.id"
    extensions = [
      # "vscodevim.vim"
    ];

    # Enable previews
    previews = {
      enable = true;
      previews = {
        web = {
          command = ["npm" "run" "dev" "--" "--port" "$PORT" "--host" "0.0.0.0"];
          manager = "web";
          cwd = "web";
        };
      };
    };
  };
}
