import { Fragment } from "react";

import type { Host } from "@/lib/config/workshops";

export function HostedBy({ hosts }: { hosts: ReadonlyArray<Host> }) {
  return (
    <>
      {hosts.map((host, i) => (
        <Fragment key={i}>
          {i > 0 && " x "}
          {host.instagram ? (
            <a
              href={host.instagram}
              target="_blank"
              rel="noreferrer noopener"
              className="underline underline-offset-2 hover:text-primary"
            >
              {host.name}
            </a>
          ) : (
            host.name
          )}
        </Fragment>
      ))}
    </>
  );
}
