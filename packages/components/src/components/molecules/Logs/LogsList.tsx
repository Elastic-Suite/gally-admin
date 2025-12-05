import React from 'react'
import { Box, Typography } from '@mui/material'
import { ILog } from '@elastic-suite/gally-admin-shared'

interface IProps {
  logs: ILog[]
}

const getSeverityColor = (severity: string): string => {
  switch (severity) {
    case 'error':
      return '#ff6b6b'
    case 'warning':
      return '#ffd93d'
    case 'info':
      return '#6bcf7f'
    case 'debug':
      return '#a8dadc'
    default:
      return '#ffffff'
  }
}

const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp)
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
}

function LogsList(props: IProps): JSX.Element {
  const { logs } = props

  return (
    <Box
      sx={{
        fontFamily: '"Courier New", Courier, monospace',
        fontSize: '14px',
        padding: '16px',
        overflowX: 'auto',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        backgroundColor: '#f5f5f5',
        borderRadius: '4px',
      }}
    >
      {logs.length === 0 ? (
        <Typography sx={{ color: '#666', fontStyle: 'italic' }}>
          No logs available
        </Typography>
      ) : (
        logs.map((log) => (
          <Box
            key={log.id}
            sx={{
              marginBottom: '8px',
              paddingBottom: '8px',
              borderBottom: '1px solid #e0e0e0',
              '&:last-child': {
                borderBottom: 'none',
              },
            }}
          >
            <Typography
              component="span"
              sx={{
                color: '#666',
                marginRight: '12px',
              }}
            >
              [{formatTimestamp(log.loggedAt)}]
            </Typography>
            <Typography
              component="span"
              sx={{
                color: getSeverityColor(log.severity),
                fontWeight: 'bold',
                marginRight: '12px',
                textTransform: 'uppercase',
              }}
            >
              {log.severity}
            </Typography>
            <Typography
              component="span"
              sx={{
                color: '#333',
              }}
            >
              {log.message}
            </Typography>
          </Box>
        ))
      )}
    </Box>
  )
}

export default LogsList
