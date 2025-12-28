import styled from 'styled-components'
import {
  Button,
  Badge,
  Input,
  Card,
  Alert,
  Spinner,
  Checkbox,
  Container,
  Grid,
  Stack,
  ButtonGroup as EgirlButtonGroup,
  Heading,
  Text,
  AnnouncementBar,
  Modal,
  Tooltip,
  Pagination,
  Gallery,
  FadeIn,
  // Admin
  BulkActionToolbar,
  SystemHealthIndicator,
  MetricCard,
  TrendIndicator,
  LineChart,
  BarChart,
  PieChart,
  LeaderboardTable,
  // Creator
  TagInput,
  ContentPreview,
  // Forms
  DatePicker,
  RangeSlider,
  ColorPicker,
  PhoneInput,
  // Realtime
  LiveIndicator,
  ActivityIndicator,
  TypingIndicator,
  RealtimeCounter,
} from '@transftw/lilith-ui'
import { useState } from 'react'

const PageContainer = styled.div`
  max-width: 1200px;
`

const PageHeader = styled.header`
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 2px solid ${props => props.theme.colors.border};

  h1 {
    font-size: 48px;
    color: ${props => props.theme.colors.primary};
    margin-bottom: 10px;
  }

  p {
    font-size: 18px;
    color: ${props => props.theme.colors.text.secondary};
  }
`

const ComponentSection = styled.section`
  margin-bottom: 60px;
`

const ComponentTitle = styled.h2`
  font-size: 28px;
  color: ${props => props.theme.colors.secondary};
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`

const ComponentDemo = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 30px;
  margin-bottom: 15px;
`

const ComponentDescription = styled.p`
  font-size: 14px;
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: 20px;
  line-height: 1.6;
`

const DemoGrid = styled.div`
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  align-items: center;
`

interface ComponentsPageProps {
  category: string
}

export function ComponentsPage({ category }: ComponentsPageProps) {
  const [showModal, setShowModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const categoryTitles: Record<string, string> = {
    primitives: 'Primitives',
    layout: 'Layout',
    typography: 'Typography',
    navigation: 'Navigation',
    feedback: 'Feedback',
    data: 'Data',
    animated: 'Animated',
    admin: 'Admin Dashboard',
    analytics: 'Analytics & Data Visualization',
    creator: 'Creator Tools',
    forms: 'Advanced Forms',
    realtime: 'Real-Time & Notifications',
  }

  const categoryDescriptions: Record<string, string> = {
    primitives: 'Core UI building blocks - buttons, inputs, cards, badges, and more.',
    layout: 'Layout components for structuring your pages - containers, grids, stacks, and spacing.',
    typography: 'Text components with theme-aware fonts and sizing.',
    navigation: 'Navigation components for headers, tabs, and site navigation.',
    feedback: 'Interactive feedback components - modals, tooltips, alerts, and toasts.',
    data: 'Data display components - tables, galleries, and pagination.',
    animated: 'Animation components for smooth, engaging user experiences.',
    admin: 'Admin dashboard components for user management, moderation, system health, and audit logs.',
    analytics: 'Data visualization and analytics components - charts, metrics, trends, and leaderboards.',
    creator: 'Content creation tools for rich text editing, media upload, and content management.',
    forms: 'Advanced form components including multi-step forms, date pickers, and specialized inputs.',
    realtime: 'Real-time UI components for live indicators, presence, notifications, and live updates.',
  }

  const renderPrimitives = () => (
    <>
      <ComponentSection>
        <ComponentTitle>Button</ComponentTitle>
        <ComponentDescription>
          Primary action buttons with multiple variants and sizes.
        </ComponentDescription>
        <ComponentDemo>
          <DemoGrid>
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="accent">Accent</Button>
            <Button variant="primary" size="sm">Small</Button>
            <Button variant="primary" size="lg">Large</Button>
          </DemoGrid>
        </ComponentDemo>
      </ComponentSection>

      <ComponentSection>
        <ComponentTitle>Badge</ComponentTitle>
        <ComponentDescription>
          Small status indicators and labels.
        </ComponentDescription>
        <ComponentDemo>
          <DemoGrid>
            <Badge variant="primary">Primary</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="error">Error</Badge>
            <Badge variant="info">Info</Badge>
          </DemoGrid>
        </ComponentDemo>
      </ComponentSection>

      <ComponentSection>
        <ComponentTitle>Input</ComponentTitle>
        <ComponentDescription>
          Text input fields with theme-aware styling.
        </ComponentDescription>
        <ComponentDemo>
          <Stack gap="md">
            <Input placeholder="Enter text..." />
            <Input placeholder="With label" label="Username" />
            <Input placeholder="Disabled" disabled />
          </Stack>
        </ComponentDemo>
      </ComponentSection>

      <ComponentSection>
        <ComponentTitle>Card</ComponentTitle>
        <ComponentDescription>
          Container component with elevation and border.
        </ComponentDescription>
        <ComponentDemo>
          <Card>
            <Heading as="h3">Card Title</Heading>
            <Text>This is a card component with themed styling.</Text>
          </Card>
        </ComponentDemo>
      </ComponentSection>

      <ComponentSection>
        <ComponentTitle>Checkbox</ComponentTitle>
        <ComponentDescription>
          Checkbox input with label support.
        </ComponentDescription>
        <ComponentDemo>
          <Stack gap="sm">
            <Checkbox label="Option 1" />
            <Checkbox label="Option 2" defaultChecked />
            <Checkbox label="Disabled" disabled />
          </Stack>
        </ComponentDemo>
      </ComponentSection>

      <ComponentSection>
        <ComponentTitle>Alert</ComponentTitle>
        <ComponentDescription>
          Alert messages for different status types.
        </ComponentDescription>
        <ComponentDemo>
          <Stack gap="md">
            <Alert variant="info">This is an info alert.</Alert>
            <Alert variant="success">Operation completed successfully!</Alert>
            <Alert variant="warning">Warning: Please review this action.</Alert>
            <Alert variant="error">Error: Something went wrong.</Alert>
          </Stack>
        </ComponentDemo>
      </ComponentSection>

      <ComponentSection>
        <ComponentTitle>Spinner</ComponentTitle>
        <ComponentDescription>
          Loading spinner indicator.
        </ComponentDescription>
        <ComponentDemo>
          <DemoGrid>
            <Spinner size="sm" />
            <Spinner size="md" />
            <Spinner size="lg" />
          </DemoGrid>
        </ComponentDemo>
      </ComponentSection>
    </>
  )

  const renderLayout = () => (
    <>
      <ComponentSection>
        <ComponentTitle>Container</ComponentTitle>
        <ComponentDescription>
          Centered content container with max-width.
        </ComponentDescription>
        <ComponentDemo>
          <Container>
            <Text>This content is centered with a max-width.</Text>
          </Container>
        </ComponentDemo>
      </ComponentSection>

      <ComponentSection>
        <ComponentTitle>Stack</ComponentTitle>
        <ComponentDescription>
          Vertical layout with consistent spacing.
        </ComponentDescription>
        <ComponentDemo>
          <Stack gap="md">
            <Card>Item 1</Card>
            <Card>Item 2</Card>
            <Card>Item 3</Card>
          </Stack>
        </ComponentDemo>
      </ComponentSection>

      <ComponentSection>
        <ComponentTitle>Grid</ComponentTitle>
        <ComponentDescription>
          Responsive grid layout.
        </ComponentDescription>
        <ComponentDemo>
          <Grid columns={3} gap="md">
            <Card>Grid Item 1</Card>
            <Card>Grid Item 2</Card>
            <Card>Grid Item 3</Card>
          </Grid>
        </ComponentDemo>
      </ComponentSection>

      <ComponentSection>
        <ComponentTitle>ButtonGroup</ComponentTitle>
        <ComponentDescription>
          Group related buttons together.
        </ComponentDescription>
        <ComponentDemo>
          <EgirlButtonGroup>
            <Button variant="primary">First</Button>
            <Button variant="secondary">Second</Button>
            <Button variant="secondary">Third</Button>
          </EgirlButtonGroup>
        </ComponentDemo>
      </ComponentSection>
    </>
  )

  const renderTypography = () => (
    <>
      <ComponentSection>
        <ComponentTitle>Heading</ComponentTitle>
        <ComponentDescription>
          Headings with theme-aware fonts (serif for luxe, monospace for cyberpunk).
        </ComponentDescription>
        <ComponentDemo>
          <Stack gap="md">
            <Heading as="h1">Heading 1</Heading>
            <Heading as="h2">Heading 2</Heading>
            <Heading as="h3">Heading 3</Heading>
            <Heading as="h4">Heading 4</Heading>
          </Stack>
        </ComponentDemo>
      </ComponentSection>

      <ComponentSection>
        <ComponentTitle>Text</ComponentTitle>
        <ComponentDescription>
          Body text with different variants.
        </ComponentDescription>
        <ComponentDemo>
          <Stack gap="sm">
            <Text size="base">Body text (default)</Text>
            <Text size="sm">Small text</Text>
            <Text size="xs">Extra small text</Text>
          </Stack>
        </ComponentDemo>
      </ComponentSection>
    </>
  )

  const renderNavigation = () => (
    <>
      <ComponentSection>
        <ComponentTitle>AnnouncementBar</ComponentTitle>
        <ComponentDescription>
          Top-of-page announcement banner.
        </ComponentDescription>
        <ComponentDemo>
          <AnnouncementBar message="🎉 New features available! Check out our latest updates." />
        </ComponentDemo>
      </ComponentSection>
    </>
  )

  const renderFeedback = () => (
    <>
      <ComponentSection>
        <ComponentTitle>Modal</ComponentTitle>
        <ComponentDescription>
          Dialog overlay for focused interactions.
        </ComponentDescription>
        <ComponentDemo>
          <Button onClick={() => setShowModal(true)}>Open Modal</Button>
          <Modal
            isOpen={showModal}
            title="Example Modal"
            onClose={() => setShowModal(false)}
          >
            <Text>This is modal content.</Text>
          </Modal>
        </ComponentDemo>
      </ComponentSection>

      <ComponentSection>
        <ComponentTitle>Tooltip</ComponentTitle>
        <ComponentDescription>
          Hover tooltips for additional context.
        </ComponentDescription>
        <ComponentDemo>
          <Tooltip content="This is a tooltip">
            <Button variant="secondary">Hover me</Button>
          </Tooltip>
        </ComponentDemo>
      </ComponentSection>
    </>
  )

  const renderData = () => (
    <>
      <ComponentSection>
        <ComponentTitle>Pagination</ComponentTitle>
        <ComponentDescription>
          Page navigation component.
        </ComponentDescription>
        <ComponentDemo>
          <Pagination
            currentPage={currentPage}
            totalPages={10}
            onPageChange={setCurrentPage}
          />
        </ComponentDemo>
      </ComponentSection>

      <ComponentSection>
        <ComponentTitle>Gallery</ComponentTitle>
        <ComponentDescription>
          Image gallery component with grid layout. Click images to view in lightbox. Use arrow keys or buttons to navigate.
        </ComponentDescription>
        <ComponentDemo>
          <Gallery
            images={[
              {
                src: 'https://picsum.photos/600/400?random=1',
                thumbnail: 'https://picsum.photos/300/200?random=1',
                alt: 'Nature landscape',
                title: 'Mountain View',
                description: 'Beautiful mountain landscape with snow-capped peaks',
                category: 'nature'
              },
              {
                src: 'https://picsum.photos/600/400?random=2',
                thumbnail: 'https://picsum.photos/300/200?random=2',
                alt: 'City skyline',
                title: 'Urban Scene',
                description: 'Modern city architecture at sunset',
                category: 'urban'
              },
              {
                src: 'https://picsum.photos/600/400?random=3',
                thumbnail: 'https://picsum.photos/300/200?random=3',
                alt: 'Ocean view',
                title: 'Coastal Beauty',
                description: 'Serene ocean waves at golden hour',
                category: 'nature'
              },
              {
                src: 'https://picsum.photos/600/400?random=4',
                thumbnail: 'https://picsum.photos/300/200?random=4',
                alt: 'Abstract art',
                title: 'Creative Expression',
                description: 'Colorful abstract composition',
                category: 'art'
              },
              {
                src: 'https://picsum.photos/600/400?random=5',
                thumbnail: 'https://picsum.photos/300/200?random=5',
                alt: 'Forest path',
                title: 'Woodland Trail',
                description: 'Peaceful forest pathway in autumn',
                category: 'nature'
              },
              {
                src: 'https://picsum.photos/600/400?random=6',
                thumbnail: 'https://picsum.photos/300/200?random=6',
                alt: 'Street photography',
                title: 'City Life',
                description: 'Bustling urban street scene',
                category: 'urban'
              },
            ]}
            columns={3}
            showFilters={true}
          />
        </ComponentDemo>
      </ComponentSection>
    </>
  )

  const renderAnimated = () => (
    <>
      <ComponentSection>
        <ComponentTitle>FadeIn</ComponentTitle>
        <ComponentDescription>
          Fade-in animation wrapper for smooth content reveals.
        </ComponentDescription>
        <ComponentDemo>
          <FadeIn>
            <Card>
              <Heading as="h3">Animated Content</Heading>
              <Text>This content fades in smoothly.</Text>
            </Card>
          </FadeIn>
        </ComponentDemo>
      </ComponentSection>
    </>
  )

  const renderAdmin = () => (
    <>
      <ComponentSection>
        <ComponentTitle>Bulk Action Toolbar</ComponentTitle>
        <ComponentDescription>
          Toolbar for performing bulk actions on selected items.
        </ComponentDescription>
        <ComponentDemo>
          <BulkActionToolbar
            selectedCount={5}
            actions={[
              { id: 'delete', label: 'Delete', variant: 'danger' },
              { id: 'archive', label: 'Archive', variant: 'secondary' }
            ]}
            onAction={(action) => console.log('Action:', action)}
            onClearSelection={() => console.log('Clear selection')}
          />
        </ComponentDemo>
      </ComponentSection>

      <ComponentSection>
        <ComponentTitle>System Health Indicator</ComponentTitle>
        <ComponentDescription>
          Display system status and health metrics.
        </ComponentDescription>
        <ComponentDemo>
          <SystemHealthIndicator
            services={[
              { name: 'API', status: 'healthy', responseTime: 45, lastCheck: new Date() },
              { name: 'Database', status: 'healthy', responseTime: 12, lastCheck: new Date() },
              { name: 'Cache', status: 'degraded', responseTime: 150, lastCheck: new Date() }
            ]}
            metrics={[
              { name: 'CPU', value: 45, max: 100, unit: '%', threshold: { warning: 70, critical: 90 } },
              { name: 'Memory', value: 6.2, max: 16, unit: 'GB', threshold: { warning: 12, critical: 14 } }
            ]}
          />
        </ComponentDemo>
      </ComponentSection>
    </>
  )

  const renderAnalytics = () => (
    <>
      <ComponentSection>
        <ComponentTitle>Metric Card</ComponentTitle>
        <ComponentDescription>
          Display key metrics with trends and changes.
        </ComponentDescription>
        <ComponentDemo>
          <DemoGrid>
            <MetricCard label="Revenue" value={15420} format="currency" change={12.5} trend="up" />
            <MetricCard label="Users" value={1523} change={-3.2} trend="down" />
            <MetricCard label="Conversion" value={4.8} format="percentage" trend="neutral" />
          </DemoGrid>
        </ComponentDemo>
      </ComponentSection>

      <ComponentSection>
        <ComponentTitle>Trend Indicator</ComponentTitle>
        <ComponentDescription>
          Show trends with up/down indicators.
        </ComponentDescription>
        <ComponentDemo>
          <DemoGrid>
            <TrendIndicator value={15.5} trend="up" label="vs last month" />
            <TrendIndicator value={-8.2} trend="down" label="vs last month" />
            <TrendIndicator value={0.5} trend="neutral" label="vs last month" />
          </DemoGrid>
        </ComponentDemo>
      </ComponentSection>

      <ComponentSection>
        <ComponentTitle>Line Chart</ComponentTitle>
        <ComponentDescription>
          Time-series data visualization.
        </ComponentDescription>
        <ComponentDemo>
          <LineChart
            data={[
              { x: 1, y: 30 },
              { x: 2, y: 45 },
              { x: 3, y: 40 },
              { x: 4, y: 60 },
              { x: 5, y: 55 },
              { x: 6, y: 70 }
            ]}
            curve
            fillArea
          />
        </ComponentDemo>
      </ComponentSection>

      <ComponentSection>
        <ComponentTitle>Bar Chart</ComponentTitle>
        <ComponentDescription>
          Comparison data visualization.
        </ComponentDescription>
        <ComponentDemo>
          <BarChart
            data={[
              { label: 'Jan', value: 30 },
              { label: 'Feb', value: 45 },
              { label: 'Mar', value: 60 },
              { label: 'Apr', value: 40 },
              { label: 'May', value: 70 }
            ]}
            showValues
          />
        </ComponentDemo>
      </ComponentSection>

      <ComponentSection>
        <ComponentTitle>Pie Chart</ComponentTitle>
        <ComponentDescription>
          Distribution visualization with optional donut mode.
        </ComponentDescription>
        <ComponentDemo>
          <PieChart
            data={[
              { label: 'Desktop', value: 45 },
              { label: 'Mobile', value: 35 },
              { label: 'Tablet', value: 20 }
            ]}
            showLegend
          />
        </ComponentDemo>
      </ComponentSection>

      <ComponentSection>
        <ComponentTitle>Leaderboard Table</ComponentTitle>
        <ComponentDescription>
          Ranked list display with scores and changes.
        </ComponentDescription>
        <ComponentDemo>
          <LeaderboardTable
            entries={[
              { id: '1', rank: 1, name: 'Alice', score: 9500, change: 2 },
              { id: '2', rank: 2, name: 'Bob', score: 8200, change: -1 },
              { id: '3', rank: 3, name: 'Charlie', score: 7800, change: 1 }
            ]}
            scoreLabel="Points"
          />
        </ComponentDemo>
      </ComponentSection>
    </>
  )

  const renderCreator = () => (
    <>
      <ComponentSection>
        <ComponentTitle>Tag Input</ComponentTitle>
        <ComponentDescription>
          Add and manage tags with suggestions.
        </ComponentDescription>
        <ComponentDemo>
          <TagInput
            value={['react', 'typescript', 'ui']}
            onChange={(tags) => console.log('Tags:', tags)}
            maxTags={10}
            suggestions={['javascript', 'css', 'design', 'frontend']}
          />
        </ComponentDemo>
      </ComponentSection>

      <ComponentSection>
        <ComponentTitle>Content Preview</ComponentTitle>
        <ComponentDescription>
          Preview content with metadata.
        </ComponentDescription>
        <ComponentDemo>
          <ContentPreview
            title="Sample Blog Post"
            content="<p>This is a preview of the content with <strong>rich formatting</strong>.</p>"
            author="John Doe"
            publishedAt={new Date()}
            tags={['react', 'tutorial']}
            status="published"
          />
        </ComponentDemo>
      </ComponentSection>
    </>
  )

  const renderForms = () => (
    <>
      <ComponentSection>
        <ComponentTitle>Date Picker</ComponentTitle>
        <ComponentDescription>
          Calendar date selection.
        </ComponentDescription>
        <ComponentDemo>
          <DatePicker value={new Date()} onChange={(date) => console.log('Date:', date)} />
        </ComponentDemo>
      </ComponentSection>

      <ComponentSection>
        <ComponentTitle>Range Slider</ComponentTitle>
        <ComponentDescription>
          Dual-handle range selection.
        </ComponentDescription>
        <ComponentDemo>
          <RangeSlider
            min={0}
            max={100}
            value={[25, 75]}
            onChange={(range) => console.log('Range:', range)}
            showValues
          />
        </ComponentDemo>
      </ComponentSection>

      <ComponentSection>
        <ComponentTitle>Color Picker</ComponentTitle>
        <ComponentDescription>
          Color selection with presets.
        </ComponentDescription>
        <ComponentDemo>
          <ColorPicker
            value="#8B5CF6"
            onChange={(color) => console.log('Color:', color)}
            showInput
          />
        </ComponentDemo>
      </ComponentSection>

      <ComponentSection>
        <ComponentTitle>Phone Input</ComponentTitle>
        <ComponentDescription>
          International phone number input.
        </ComponentDescription>
        <ComponentDemo>
          <PhoneInput
            value=""
            onChange={(value, code) => console.log('Phone:', code, value)}
          />
        </ComponentDemo>
      </ComponentSection>
    </>
  )

  const renderRealtime = () => (
    <>
      <ComponentSection>
        <ComponentTitle>Live Indicator</ComponentTitle>
        <ComponentDescription>
          Pulsing live status indicator.
        </ComponentDescription>
        <ComponentDemo>
          <DemoGrid>
            <LiveIndicator />
            <LiveIndicator variant="compact" />
          </DemoGrid>
        </ComponentDemo>
      </ComponentSection>

      <ComponentSection>
        <ComponentTitle>Activity Indicator</ComponentTitle>
        <ComponentDescription>
          Online/offline/away/busy status indicators.
        </ComponentDescription>
        <ComponentDemo>
          <DemoGrid>
            <ActivityIndicator status="online" showLabel />
            <ActivityIndicator status="offline" showLabel />
            <ActivityIndicator status="away" showLabel />
            <ActivityIndicator status="busy" showLabel />
          </DemoGrid>
        </ComponentDemo>
      </ComponentSection>

      <ComponentSection>
        <ComponentTitle>Typing Indicator</ComponentTitle>
        <ComponentDescription>
          Animated typing indicator for chat.
        </ComponentDescription>
        <ComponentDemo>
          <DemoGrid>
            <TypingIndicator users={['Alice']} />
            <TypingIndicator users={['Bob', 'Charlie']} />
          </DemoGrid>
        </ComponentDemo>
      </ComponentSection>

      <ComponentSection>
        <ComponentTitle>Realtime Counter</ComponentTitle>
        <ComponentDescription>
          Animated counter with trend indication.
        </ComponentDescription>
        <ComponentDemo>
          <DemoGrid>
            <RealtimeCounter value={1523} label="Active Users" trend="up" />
            <RealtimeCounter value={42} label="Live Sessions" />
          </DemoGrid>
        </ComponentDemo>
      </ComponentSection>
    </>
  )

  const renderContent = () => {
    switch (category) {
      case 'primitives':
        return renderPrimitives()
      case 'layout':
        return renderLayout()
      case 'typography':
        return renderTypography()
      case 'navigation':
        return renderNavigation()
      case 'feedback':
        return renderFeedback()
      case 'data':
        return renderData()
      case 'animated':
        return renderAnimated()
      case 'admin':
        return renderAdmin()
      case 'analytics':
        return renderAnalytics()
      case 'creator':
        return renderCreator()
      case 'forms':
        return renderForms()
      case 'realtime':
        return renderRealtime()
      default:
        return <Text>Category not found</Text>
    }
  }

  return (
    <PageContainer>
      <PageHeader>
        <h1>{categoryTitles[category]}</h1>
        <p>{categoryDescriptions[category]}</p>
      </PageHeader>
      {renderContent()}
    </PageContainer>
  )
}
