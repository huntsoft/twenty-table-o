import { ActionHookWithObjectMetadataItem } from '@/action-menu/actions/types/ActionHook';
import { contextStoreCurrentViewIdComponentState } from '@/context-store/states/contextStoreCurrentViewIdComponentState';

import { contextStoreFiltersComponentState } from '@/context-store/states/contextStoreFiltersComponentState';
import { contextStoreTargetedRecordsRuleComponentState } from '@/context-store/states/contextStoreTargetedRecordsRuleComponentState';
import { computeContextStoreFilters } from '@/context-store/utils/computeContextStoreFilters';
import { DEFAULT_QUERY_PAGE_SIZE } from '@/object-record/constants/DefaultQueryPageSize';
import { RecordGqlOperationFilter } from '@/object-record/graphql/types/RecordGqlOperationFilter';
import { useDestroyManyRecords } from '@/object-record/hooks/useDestroyManyRecords';
import { useLazyFetchAllRecords } from '@/object-record/hooks/useLazyFetchAllRecords';
import { useFilterValueDependencies } from '@/object-record/record-filter/hooks/useFilterValueDependencies';
import { useRecordTable } from '@/object-record/record-table/hooks/useRecordTable';
import { getRecordIndexIdFromObjectNamePluralAndViewId } from '@/object-record/utils/getRecordIndexIdFromObjectNamePluralAndViewId';
import { ConfirmationModal } from '@/ui/layout/modal/components/ConfirmationModal';
import { useRecoilComponentValueV2 } from '@/ui/utilities/state/component-state/hooks/useRecoilComponentValueV2';
import { useCallback, useState } from 'react';

export const useDestroyMultipleRecordsAction: ActionHookWithObjectMetadataItem =
  ({ objectMetadataItem }) => {
    const [isDestroyRecordsModalOpen, setIsDestroyRecordsModalOpen] =
      useState(false);

    const contextStoreCurrentViewId = useRecoilComponentValueV2(
      contextStoreCurrentViewIdComponentState,
    );

    if (!contextStoreCurrentViewId) {
      throw new Error('Current view ID is not defined');
    }

    const { resetTableRowSelection } = useRecordTable({
      recordTableId: getRecordIndexIdFromObjectNamePluralAndViewId(
        objectMetadataItem.namePlural,
        contextStoreCurrentViewId,
      ),
    });

    const { destroyManyRecords } = useDestroyManyRecords({
      objectNameSingular: objectMetadataItem.nameSingular,
    });

    const contextStoreTargetedRecordsRule = useRecoilComponentValueV2(
      contextStoreTargetedRecordsRuleComponentState,
    );

    const contextStoreFilters = useRecoilComponentValueV2(
      contextStoreFiltersComponentState,
    );

    const { filterValueDependencies } = useFilterValueDependencies();

    const deletedAtFilter: RecordGqlOperationFilter = {
      deletedAt: { is: 'NOT_NULL' },
    };
    const graphqlFilter = {
      ...computeContextStoreFilters(
        contextStoreTargetedRecordsRule,
        contextStoreFilters,
        objectMetadataItem,
        filterValueDependencies,
      ),
      ...deletedAtFilter,
    };

    const { fetchAllRecords: fetchAllRecordIds } = useLazyFetchAllRecords({
      objectNameSingular: objectMetadataItem.nameSingular,
      filter: graphqlFilter,
      limit: DEFAULT_QUERY_PAGE_SIZE,
      recordGqlFields: { id: true },
    });

    const handleDestroyClick = useCallback(async () => {
      const recordsToDestroy = await fetchAllRecordIds();
      const recordIdsToDestroy = recordsToDestroy.map((record) => record.id);

      resetTableRowSelection();

      await destroyManyRecords({ recordIdsToDestroy });
    }, [destroyManyRecords, fetchAllRecordIds, resetTableRowSelection]);

    const onClick = () => {
      setIsDestroyRecordsModalOpen(true);
    };

    const confirmationModal = (
      <ConfirmationModal
        isOpen={isDestroyRecordsModalOpen}
        setIsOpen={setIsDestroyRecordsModalOpen}
        title={'Permanently Destroy Records'}
        subtitle={
          "Are you sure you want to destroy these records? They won't be recoverable anymore."
        }
        onConfirmClick={handleDestroyClick}
        confirmButtonText={'Destroy Records'}
      />
    );

    return {
      onClick,
      ConfirmationModal: confirmationModal,
    };
  };
