import React, { useEffect, useState } from 'react'
import { GroupByResources, ObjectConfig, ObjectReturn } from '../interfaces/groupBy-interfaces';


const useGroupByCalendar = (configuracion: ObjectConfig, groupBy:GroupByResources) => {

    const [events, setEvents] = useState<any[]>([])
    const [resources, setResources] = useState<any[]>([])
    const [resourceAccessor, setResourceAccessor] = useState('')
    const [buttonGroupBy, setButtonGroupBy] = useState('')
    useEffect(() => {
        setEvents(configuracion[groupBy].events ?? [])
        setResources(configuracion[groupBy].resources ?? [])
        setResourceAccessor(configuracion[groupBy].resourceAccessor ?? '')
        setButtonGroupBy(configuracion[groupBy].buttonGroupBy ?? '')
    }, [groupBy, configuracion.spaces.resources])

    return {
        groupBy,
        events,
        resources,
        resourceAccessor,
        buttonGroupBy
    }
}

export default useGroupByCalendar