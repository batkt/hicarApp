import moment from 'moment'
export default function dateDiff(start, end, turul = 'minute') {
    return moment(end).diff(moment(start), turul)
}