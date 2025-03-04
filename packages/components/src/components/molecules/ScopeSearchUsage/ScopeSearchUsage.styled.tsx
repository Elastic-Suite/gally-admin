import { styled } from '@mui/system'
import Form from '../../atoms/form/Form'

export const ScopeSearchUsageForm = styled(Form)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-end',
  flexWrap: 'wrap',
  gap: theme.spacing(4),
}))
