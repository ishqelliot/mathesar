<script lang="ts">
  import { createEventDispatcher, getContext, tick } from 'svelte';
  import { faSpinner } from '@fortawesome/free-solid-svg-icons';
  import {
    Button, Icon,
  } from '@mathesar-component-library';
  import { abstractTypes } from '@mathesar/stores/abstract-types';
  import {
    ColumnsDataStore,
  } from '@mathesar/stores/table-data';
  import { States } from '@mathesar/utils/api';

  import type {
    Column,
    TabularData,
    TabularDataStore,
  } from '@mathesar/stores/table-data/types';
  import type { AbstractType } from '@mathesar/stores/abstract-types/types.d';

  import TypeOptions from './type-options/TypeOptions.svelte';

  const dispatch = createEventDispatcher();

  const tabularData = getContext<TabularDataStore>('tabularData');
  $: ({ columnsDataStore } = $tabularData as TabularData);

  export let column: Column;
  export let abstractTypeOfColumn: AbstractType;

  let abstractTypeContainer: HTMLUListElement;
  let selectedAbstractType: AbstractType = abstractTypeOfColumn;
  let saveState = States.Idle;

  $: allowedTypeConversions = ColumnsDataStore.getAllowedTypeConversions(
    column,
    $abstractTypes.data,
  );

  function selectAbstractType(abstractType: AbstractType) {
    selectedAbstractType = abstractType;
    // if (abstractType.identifier === abstractTypeOfColumn.identifier) {
    //   selectedDBTypeOption = {
    //     id: column.type,
    //     label: column.type,
    //   };
    // } else if (abstractType.defaultDbType) {
    //   selectedDBTypeOption = {
    //     id: abstractType.defaultDbType,
    //     label: abstractType.defaultDbType,
    //   };
    // }
  }

  function resetAbstractType() {
    selectedAbstractType = abstractTypeOfColumn;
    // selectedDBTypeOption = {
    //   id: column.type,
    //   label: column.type,
    // };
  }

  async function scrollToSelectedType() {
    await tick();
    const selectedElement: HTMLLIElement = abstractTypeContainer?.querySelector('li.selected');
    if (selectedElement) {
      abstractTypeContainer.scrollTop = selectedElement.offsetTop;
    }
  }

  $: if (!selectedAbstractType && abstractTypeOfColumn) {
    resetAbstractType();
    void scrollToSelectedType();
  }

  function close() {
    resetAbstractType();
    saveState = States.Done;
    dispatch('close');
  }

  function onSave() {
    // const mapToUpdate: Map<keyof Column, Column[keyof Column]> = new Map();
    // if (selectedDBTypeOption.id !== column.type) {
    //   mapToUpdate.set('type', selectedDBTypeOption.id);
    // }
    // if (defaultValue !== column.default) {
    //   mapToUpdate.set('default', defaultValue);
    // }
    // if (mapToUpdate.size > 0) {
    //   const toUpdate = Object.fromEntries(mapToUpdate);
    //   saveState = States.Loading;
    //   try {
    //     // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    //     await columnsDataStore.patch(column, toUpdate);
    //   } catch (err) {
    //     // TODO: Figure out where to place error boundaries for toast system
    //     console.error(err);
    //   }
    // }
    close();
  }
</script>

<div class="column-type-menu">
  <h5 class="menu-header">Set Column Type</h5>
  <ul bind:this={abstractTypeContainer} class="type-list">
    {#each allowedTypeConversions as abstractType (abstractType.identifier)}
      <li class:selected={selectedAbstractType?.identifier === abstractType?.identifier}>
        <Button appearance="plain" on:click={() => selectAbstractType(abstractType)}>
          <span class="data-icon">{abstractType.icon}</span>
          <span>{abstractType.name}</span>
        </Button>
      </li>
    {/each}
  </ul>

  {#if selectedAbstractType}
    <TypeOptions {selectedAbstractType} {abstractTypeOfColumn}/>
  {/if}

  <div class="divider"></div>
  <div class="type-menu-footer">
    <Button appearance="primary" disabled={
        !selectedAbstractType || saveState === States.Loading
      } on:click={onSave}>
      {#if saveState === States.Loading}
        <Icon data={faSpinner} spin={true}/>
      {/if}
      <span>Save</span>
    </Button>
    <Button appearance="default" on:click={close}>
      Close
    </Button>
  </div>
</div>

<style global lang="scss">
  @import "TypeSwitcher.scss";
</style>
