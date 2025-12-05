import React from 'react'
import { Box, Theme, Typography, useTheme } from '@mui/material'
import { ILog } from '@elastic-suite/gally-admin-shared'
import { useTranslation } from 'next-i18next'
import { selectLanguage, useAppSelector } from '../../../store'

interface IProps {
  logs: ILog[]
}

const getSeverityColor = (theme: Theme): Record<string, string> => ({
  error: theme.palette.error.main,
  warning: theme.palette.warning.main,
  info: theme.palette.info.main,
  debug: theme.palette.grey[500],
})

const formatLogDate = (value: string, language: string): string => {
  const date = new Date(value as string)
  return date.toLocaleString(language, {
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
  const { t } = useTranslation('common')
  const theme = useTheme()
  const severityColors = getSeverityColor(theme)
  const language = useAppSelector(selectLanguage)

  return (
    <Box
      sx={{
        fontFamily: '"Courier New", Courier, monospace',
        fontSize: '14px',
        padding: '16px',
        overflowX: 'auto',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        backgroundColor: theme.palette.background.default,
        borderRadius: '4px',
      }}
    >
      {logs.length === 0 ? (
        <Typography
          sx={{ color: theme.palette.text.secondary, fontStyle: 'italic' }}
        >
          {t('logs.noLogs')}
        </Typography>
      ) : (
        logs.map((log) => (
          <Box
            key={log.id}
            sx={{
              marginBottom: '8px',
              paddingBottom: '8px',
              borderBottom: `1px solid ${theme.palette.divider}`,
              '&:last-child': {
                borderBottom: 'none',
              },
            }}
          >
            <Typography
              component="span"
              sx={{
                color: theme.palette.text.secondary,
                marginRight: '12px',
              }}
            >
              [{formatLogDate(log.loggedAt, language)}]
            </Typography>
            <Typography
              component="span"
              sx={{
                color:
                  severityColors[log.severity] || theme.palette.text.primary,
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
                color: theme.palette.text.primary,
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
