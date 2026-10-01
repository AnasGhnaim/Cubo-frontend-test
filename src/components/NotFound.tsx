import { Link } from 'react-router'
import { buttonVariants } from '@/components/ui/button'
import { EmptyState } from './EmptyState'

type Props = { title?: string; description?: string }

export function NotFound({ title = 'Page not found', description = 'The page you are looking for does not exist.' }: Props) {
  return (
    <EmptyState
      title={title}
      description={description}
      action={
        <Link to="/" className={buttonVariants()}>
          Back to catalog
        </Link>
      }
    />
  )
}
