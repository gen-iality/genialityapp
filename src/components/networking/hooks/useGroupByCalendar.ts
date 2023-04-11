import React, { useEffect, useState } from 'react'
import { GroupByResources, ObjectConfig, ObjectReturn } from '../interfaces/groupBy-interfaces';


const useGroupByCalendar = (configuration: ObjectConfig, groupBy: GroupByResources) => {

    const [events, setEvents] = useState<any[]>([])
    const [resources, setResources] = useState<any[]>([])
    const [resourceAccessor, setResourceAccessor] = useState('')
    const [buttonGroupBy, setButtonGroupBy] = useState('')
    // console.log('Antes de chismosear')
    useEffect(() => {
        // console.log('Iterando con',groupBy)
        console.log('chismoseando', configuration)
        setEvents(configuration[groupBy].events ?? [])
        setResources(configuration[groupBy].resources ?? [])
        setResourceAccessor(configuration[groupBy].resourceAccessor ?? '')
        setButtonGroupBy(configuration[groupBy].buttonGroupBy ?? '')
    }, [groupBy, configuration.spaces.resources])

    return {
        groupBy,
        events,
        resources,
        resourceAccessor,
        buttonGroupBy
    }
}

export default useGroupByCalendar