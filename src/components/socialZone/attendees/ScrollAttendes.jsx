import { MessageTwoTone } from '@ant-design/icons';
import { message, Popover, Spin } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import { Tooltip } from 'chart.js';
import { List } from 'rc-field-form';
import React, { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { InitialsNameUser } from '../hooks';
import PopoverInfoUser from '../hooks/Popover';

const AttendeScroll = function(props) {
  let [loading, setLoading] = useState(false);
  let [page, setPage] = useState(0);
  let [filteredlist, setfilteredlist] = useState([]);
  let [hasMore, setHasMore] = useState(true);
  const pag = 100;

  useEffect(() => {
    console.log('LLEGA AQUI');
    console.log(props.attendes);
    setfilteredlist(props.attendes);
    setPage(1);
  }, [props.attendes]);

  const handleInfiniteOnLoad = () => {
    console.log('SCROLL HANDLE');
    setLoading(true);

    if (filteredlist.length == props.attendes.length) {
      message.warning('NO HAY MAS ASISTENTES');
      setHasMore(false);
      setLoading(false);
      return;
    }

    let ini = pag * page;
    let fin = pag * page + pag;
    //console.log('INICIO=>' + ini);
    //console.log('FIN=>' + fin);

    let newDatos = props.attendes.slice(ini, fin);
    const datosg = filteredlist.concat(newDatos);
    let pagP = page;
    pagP = pagP += 1;
    // console.log(pagP);

    setfilteredlist(datosg);
    setPage(pagP++);
    setLoading(false);
  };

  return <div style={{ height: '300px' }}></div>;
};

export default AttendeScroll;
