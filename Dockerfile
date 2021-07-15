FROM hayd/debian-deno

WORKDIR /app

RUN deno install --allow-read --allow-run --allow-write --allow-net -f --unstable https://deno.land/x/denon/denon.ts

ENV PATH="/home/${HOME}/.deno/bin:${PATH}"

