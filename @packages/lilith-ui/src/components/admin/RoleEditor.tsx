import React, { useState } from 'react'
import styled from 'styled-components'
import { Checkbox } from '../primitives/Checkbox'
import { Button } from '../primitives/Button'

export interface Permission {
  id: string
  name: string
  description?: string
  category: string
}

export interface Role {
  id: string
  name: string
  permissions: string[]
}

export interface RoleEditorProps {
  role: Role
  availablePermissions: Permission[]
  onSave: (role: Role) => void | Promise<void>
  onCancel?: () => void
  readOnly?: boolean
}

const EditorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.lg};
`

const RoleInfo = styled.div`
  padding: ${(props) => props.theme.spacing.md};
  background: ${(props) => props.theme.colors.surface};
  border-radius: ${(props) => props.theme.borderRadius.md};
`

const RoleName = styled.h3`
  margin: 0 0 ${(props) => props.theme.spacing.xs} 0;
  color: ${(props) => props.theme.colors.text};
  font-size: ${(props) => props.theme.typography.fontSize.lg};
  font-weight: ${(props) => props.theme.typography.fontWeight.bold};
`

const PermissionsTree = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.md};
`

const CategorySection = styled.div`
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.md};
  overflow: hidden;
`

const CategoryHeader = styled.div`
  padding: ${(props) => props.theme.spacing.sm} ${(props) => props.theme.spacing.md};
  background: ${(props) => props.theme.colors.surface};
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.sm};
`

const CategoryName = styled.span`
  font-weight: ${(props) => props.theme.typography.fontWeight.semibold};
  color: ${(props) => props.theme.colors.text};
  text-transform: capitalize;
`

const PermissionList = styled.div`
  padding: ${(props) => props.theme.spacing.sm};
  background: ${(props) => props.theme.colors.background};
`

const PermissionItem = styled.div`
  padding: ${(props) => props.theme.spacing.sm};
  display: flex;
  align-items: flex-start;
  gap: ${(props) => props.theme.spacing.sm};
  border-radius: ${(props) => props.theme.borderRadius.sm};

  &:hover {
    background: ${(props) => props.theme.colors.surface};
  }
`

const PermissionDetails = styled.div`
  flex: 1;
`

const PermissionName = styled.div`
  color: ${(props) => props.theme.colors.text};
  font-weight: ${(props) => props.theme.typography.fontWeight.medium};
  margin-bottom: ${(props) => props.theme.spacing.xs};
`

const PermissionDescription = styled.div`
  color: ${(props) => props.theme.colors.text.secondary};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
`

const Actions = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.sm};
  justify-content: flex-end;
  padding-top: ${(props) => props.theme.spacing.md};
  border-top: 1px solid ${(props) => props.theme.colors.border};
`

const PermissionCount = styled.span`
  color: ${(props) => props.theme.colors.text.secondary};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
`

export const RoleEditor: React.FC<RoleEditorProps> = ({
  role,
  availablePermissions,
  onSave,
  onCancel,
  readOnly = false
}) => {
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(
    new Set(role.permissions)
  )
  const [isSaving, setIsSaving] = useState(false)

  const categorizedPermissions = availablePermissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = []
    }
    acc[permission.category].push(permission)
    return acc
  }, {} as Record<string, Permission[]>)

  const togglePermission = (permissionId: string) => {
    if (readOnly) return

    const newPermissions = new Set(selectedPermissions)
    if (newPermissions.has(permissionId)) {
      newPermissions.delete(permissionId)
    } else {
      newPermissions.add(permissionId)
    }
    setSelectedPermissions(newPermissions)
  }

  const toggleCategory = (category: string) => {
    if (readOnly) return

    const categoryPermissions = categorizedPermissions[category]
    const allSelected = categoryPermissions.every(p => selectedPermissions.has(p.id))

    const newPermissions = new Set(selectedPermissions)
    categoryPermissions.forEach(p => {
      if (allSelected) {
        newPermissions.delete(p.id)
      } else {
        newPermissions.add(p.id)
      }
    })
    setSelectedPermissions(newPermissions)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave({
        ...role,
        permissions: Array.from(selectedPermissions)
      })
    } finally {
      setIsSaving(false)
    }
  }

  const isCategorySelected = (category: string) => {
    const categoryPermissions = categorizedPermissions[category]
    return categoryPermissions.every(p => selectedPermissions.has(p.id))
  }


  return (
    <EditorWrapper>
      <RoleInfo>
        <RoleName>{role.name}</RoleName>
        <PermissionCount>
          {selectedPermissions.size} of {availablePermissions.length} permissions selected
        </PermissionCount>
      </RoleInfo>

      <PermissionsTree>
        {Object.entries(categorizedPermissions).map(([category, permissions]) => (
          <CategorySection key={category}>
            <CategoryHeader>
              <Checkbox
                checked={isCategorySelected(category)}
                onChange={() => toggleCategory(category)}
                disabled={readOnly}
              />
              <CategoryName>{category}</CategoryName>
              <PermissionCount style={{ marginLeft: 'auto' }}>
                {permissions.filter(p => selectedPermissions.has(p.id)).length} / {permissions.length}
              </PermissionCount>
            </CategoryHeader>
            <PermissionList>
              {permissions.map(permission => (
                <PermissionItem key={permission.id}>
                  <Checkbox
                    checked={selectedPermissions.has(permission.id)}
                    onChange={() => togglePermission(permission.id)}
                    disabled={readOnly}
                  />
                  <PermissionDetails>
                    <PermissionName>{permission.name}</PermissionName>
                    {permission.description && (
                      <PermissionDescription>{permission.description}</PermissionDescription>
                    )}
                  </PermissionDetails>
                </PermissionItem>
              ))}
            </PermissionList>
          </CategorySection>
        ))}
      </PermissionsTree>

      {!readOnly && (
        <Actions>
          {onCancel && (
            <Button variant="ghost" onClick={onCancel} disabled={isSaving}>
              Cancel
            </Button>
          )}
          <Button variant="primary" onClick={handleSave} disabled={isSaving}>
            Save Role
          </Button>
        </Actions>
      )}
    </EditorWrapper>
  )
}
