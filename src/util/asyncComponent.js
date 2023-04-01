import React, {useEffect, useRef, useState} from "react";
import Nprogress from "nprogress";
import ReactPlaceholder from "react-placeholder";
import "nprogress/nprogress.css";

import "react-placeholder/lib/reactPlaceholder.css";
import CircularProgress from "components/CircularProgress";
import useBeforeFirstRender from "src/util/useBeforeFirstRender";

export default function asyncComponent(importComponent) {
  function AsyncFunc(props) {
    const isMounted = useRef(false)
    const [component, setComponent] = useState(null);

    const [loadedComponent, setLoadedComponent] = useState(true);

    useBeforeFirstRender(() => {
      Nprogress.start();
    });

    useEffect(() => {
      const load = async () => {
        if (loadedComponent) {
          isMounted.current = true;
          const {default: Component} = await importComponent();
          Nprogress.done();
          if (isMounted.current) {
            setComponent(<Component {...props} />)
          }
        }
      }
      load();
      return () => {
        isMounted.current = false;
        setLoadedComponent(false);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const Component = component || <CircularProgress/>;

    return (
      <ReactPlaceholder type="text" rows={7} ready={Component !== null}>
        {Component}
      </ReactPlaceholder>
    )
  }

  return AsyncFunc;
}
