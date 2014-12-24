Install
=======
> Covers install from src via linux distro.

- To install node properly, we first install `libssl-dev. This allows us ot
  fully enable an SSL connection to our node install.
- Next, we change to our `/tmp` directory in order to install our application
  package and not keep the package aftterwards.
- To get the package, we run `wget nameofpackage`.
- If this is a tar file, we can uncompress it via `tar -vxf node`
- We `cd node/.configure` and then call `make`. This will compile and configure
  the package install.
- Finally, call `sudo make install` to install the pacakge.

