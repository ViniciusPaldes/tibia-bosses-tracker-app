import { loadSelectedWorld, saveSelectedWorld, useWorlds } from '@/services/storage/worlds/hooks'
import { t } from 'i18next'
import { Fragment, useEffect, useState } from 'react'
import { styled } from 'styled-components/native'
import { SelectModal } from './SelectModal'

interface WorldDropdownProps {
  /**
   * The selected world.
   */
  world: string | null
  /**
   * The function to set the selected world.
   */
  setWorld: (world: string | null) => void
}

export function WorldDropdown({ world, setWorld }: WorldDropdownProps) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const { data: worlds, loading, error, refetch } = useWorlds()

  // preload previously selected world
  useEffect(() => {
    loadSelectedWorld().then((w) => {
      if (w) setWorld(w)
    })
  }, [setWorld])

  return (
    <Fragment>
      <Dropdown>
        <Title>{t('world')}:</Title>

        <DropdownText
          onPress={() => {
            if (!loading && !error) setPickerOpen(true)
          }}
          accessibilityRole="button"
          accessibilityLabel="Select world"
        >
          {loading ? t('loadingWorlds') : (world ?? t('selectWorld'))}
        </DropdownText>

        {!!error && (
          <>
            <ErrorText>{error}</ErrorText>
            <DropdownItem onPress={refetch}>
              <DropdownText>{t('retry')}</DropdownText>
            </DropdownItem>
          </>
        )}
      </Dropdown>

      <SelectModal
        visible={pickerOpen}
        title={t('chooseWorld')}
        data={worlds}
        onSelect={async (w) => {
          setWorld(w)
          await saveSelectedWorld(w)
        }}
        onClose={() => setPickerOpen(false)}
      />
    </Fragment>
  )
}

const Dropdown = styled.View(({ theme }) => ({
  backgroundColor: theme.tokens.colors.card,
  borderRadius: theme.tokens.radius,
  padding: 12,
  marginBottom: 16,
  opacity: 0.98,
}))

const Title = styled.Text(({ theme }) => ({
  color: theme.tokens.colors.text,
  fontFamily: theme.tokens.typography.fonts.title,
  fontSize: 16,
  marginBottom: 8,
  textAlign: 'center',
}))

const DropdownItem = styled.Pressable(() => ({
  paddingVertical: 10,
}))

const DropdownText = styled.Text(({ theme }) => ({
  color: theme.tokens.colors.text,
  fontFamily: theme.tokens.typography.fonts.title,
  fontSize: theme.tokens.typography.sizes.h3,
}))

const ErrorText = styled.Text(({ theme }) => ({
  color: theme.tokens.colors.danger,
  marginTop: 8,
}))
