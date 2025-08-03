<template>
  <q-page class="q-pa-md">
    <!-- Header -->
    <div class="q-mb-lg">
      <h4 class="text-h4 text-weight-bold q-ma-none text-grey-8">
        Gerenciar Categorias
      </h4>
      <p class="text-subtitle1 text-grey-6 q-ma-none">
        Adicione, edite ou remova categorias de receitas e despesas
      </p>
    </div>

    <!-- Botão Adicionar -->
    <div class="q-mb-lg">
      <q-btn
        label="Nova Categoria"
        color="primary"
        icon="add"
        @click="openAddDialog"
        unelevated
        no-caps
      />
    </div>

    <!-- Filtros -->
    <div class="row q-gutter-md q-mb-lg">
      <q-select
        v-model="typeFilter"
        :options="typeOptions"
        label="Filtrar por tipo"
        outlined
        style="min-width: 200px"
        clearable
      />
      <q-input
        v-model="searchFilter"
        label="Buscar categoria"
        outlined
        clearable
        style="min-width: 250px"
      >
        <template #prepend>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>

    <!-- Lista de Categorias -->
    <q-card flat class="category-card">
      <q-card-section class="q-pa-none">
        <q-list separator>
          <q-item
            v-for="category in filteredCategories"
            :key="category.id"
            class="category-item"
          >
            <q-item-section avatar>
              <q-icon
                :name="category.type === 'income' ? 'trending_up' : 'trending_down'"
                :color="category.type === 'income' ? 'positive' : 'negative'"
                size="md"
              />
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-weight-medium">{{ category.name }}</q-item-label>
              <q-item-label caption>
                <q-chip
                  :color="category.type === 'income' ? 'positive' : 'negative'"
                  text-color="white"
                  size="sm"
                  dense
                >
                  {{ category.type === 'income' ? 'Receita' : 'Despesa' }}
                </q-chip>
              </q-item-label>
            </q-item-section>

            <q-item-section side>
              <div class="row q-gutter-sm">
                <q-btn
                  icon="edit"
                  color="primary"
                  flat
                  round
                  size="sm"
                  @click="openEditDialog(category)"
                >
                  <q-tooltip>Editar</q-tooltip>
                </q-btn>
                <q-btn
                  icon="delete"
                  color="negative"
                  flat
                  round
                  size="sm"
                  @click="confirmDelete(category)"
                >
                  <q-tooltip>Excluir</q-tooltip>
                </q-btn>
              </div>
            </q-item-section>
          </q-item>

          <q-item v-if="filteredCategories.length === 0">
            <q-item-section class="text-center text-grey-6">
              <q-icon name="category" size="lg" class="q-mb-md" />
              <div>Nenhuma categoria encontrada</div>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>

    <!-- Dialog Adicionar/Editar -->
    <q-dialog v-model="showDialog" persistent>
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">{{ isEditing ? 'Editar Categoria' : 'Nova Categoria' }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit.prevent="saveCategory" class="q-gutter-md">
            <q-input
              v-model="categoryForm.name"
              label="Nome da categoria"
              outlined
              :rules="[val => !!val || 'Nome é obrigatório']"
              autofocus
            />

            <q-select
              v-model="categoryForm.type"
              :options="[
                { label: 'Receita', value: 'income' },
                { label: 'Despesa', value: 'expense' }
              ]"
              label="Tipo"
              outlined
              emit-value
              map-options
              :rules="[val => !!val || 'Tipo é obrigatório']"
            />
          </q-form>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            label="Cancelar"
            color="grey-6"
            flat
            @click="closeDialog"
            no-caps
          />
          <q-btn
            :label="isEditing ? 'Salvar' : 'Criar'"
            color="primary"
            @click="saveCategory"
            :loading="saving"
            unelevated
            no-caps
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog Confirmação Exclusão -->
    <q-dialog v-model="showDeleteDialog" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">Confirmar Exclusão</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Tem certeza que deseja excluir a categoria "{{ categoryToDelete?.name }}"?
          <br><br>
          <span class="text-negative text-weight-medium">
            Esta ação não pode ser desfeita.
          </span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            label="Cancelar"
            color="grey-6"
            flat
            @click="showDeleteDialog = false"
            no-caps
          />
          <q-btn
            label="Excluir"
            color="negative"
            @click="deleteCategory"
            :loading="deleting"
            unelevated
            no-caps
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
defineOptions({ name: 'CategoryManagerPage' })

import { ref, onMounted, computed } from 'vue'
import { useQuasar } from 'quasar'
import { supabase } from 'src/boot/supabase'

interface Category {
  id: number
  name: string
  type: 'income' | 'expense'
}

const $q = useQuasar()

// Estado
const categories = ref<Category[]>([])
const showDialog = ref(false)
const showDeleteDialog = ref(false)
const isEditing = ref(false)
const saving = ref(false)
const deleting = ref(false)
const categoryToDelete = ref<Category | null>(null)

// Filtros
const typeFilter = ref<string | null>(null)
const searchFilter = ref('')

const typeOptions = [
  { label: 'Receitas', value: 'income' },
  { label: 'Despesas', value: 'expense' }
]

// Formulário
const categoryForm = ref({
  id: null as number | null,
  name: '',
  type: 'expense' as 'income' | 'expense'
})

// Computed
const filteredCategories = computed(() => {
  let filtered = categories.value

  if (typeFilter.value) {
    filtered = filtered.filter(cat => cat.type === typeFilter.value)
  }

  if (searchFilter.value) {
    const search = searchFilter.value.toLowerCase()
    filtered = filtered.filter(cat => 
      cat.name.toLowerCase().includes(search)
    )
  }

  return filtered.sort((a, b) => a.name.localeCompare(b.name))
})

// Métodos
const loadCategories = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      console.error('Usuário não autenticado')
      return
    }
    
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', user.id)
      .order('name')

    if (error) throw error
    
    categories.value = (data ?? []) as Category[]

    // Se não houver categorias, criar algumas padrão
    if (categories.value.length === 0) {
      categories.value = [
        { id: 1, name: 'Alimentação', type: 'expense' },
        { id: 2, name: 'Transporte', type: 'expense' },
        { id: 3, name: 'Salário', type: 'income' },
        { id: 4, name: 'Freelance', type: 'income' },
        { id: 5, name: 'Lazer', type: 'expense' }
      ]
    }
  } catch (error) {
    console.error('Erro ao carregar categorias:', error)
    $q.notify({
      type: 'negative',
      message: 'Erro ao carregar categorias',
      position: 'top'
    })
  }
}

const openAddDialog = () => {
  isEditing.value = false
  categoryForm.value = {
    id: null,
    name: '',
    type: 'expense'
  }
  showDialog.value = true
}

const openEditDialog = (category: Category) => {
  isEditing.value = true
  categoryForm.value = {
    id: category.id,
    name: category.name,
    type: category.type
  }
  showDialog.value = true
}

const closeDialog = () => {
  showDialog.value = false
  categoryForm.value = {
    id: null,
    name: '',
    type: 'expense'
  }
}

const saveCategory = async () => {
  if (!categoryForm.value.name.trim()) {
    $q.notify({
      type: 'negative',
      message: 'Nome da categoria é obrigatório',
      position: 'top'
    })
    return
  }

  saving.value = true

  try {
    if (isEditing.value) {
      // Editar categoria existente
      const { error } = await supabase
        .from('categories')
        .update({
          name: categoryForm.value.name.trim(),
          type: categoryForm.value.type
        })
        .eq('id', categoryForm.value.id)

      if (error) throw error

      // Atualizar localmente
      const index = categories.value.findIndex(cat => cat.id === categoryForm.value.id)
      if (index !== -1) {
        const existingCategory = categories.value[index]
        if (!existingCategory) return
        
        const updatedCategory: Category = {
          id: existingCategory.id,
          name: categoryForm.value.name.trim(),
          type: categoryForm.value.type
        }
        categories.value[index] = updatedCategory
      }

      $q.notify({
        type: 'positive',
        message: 'Categoria atualizada com sucesso!',
        position: 'top'
      })
    } else {
      // Criar nova categoria
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error('Usuário não autenticado')
      }
      
      const { data, error } = await supabase
        .from('categories')
        .insert([{
          name: categoryForm.value.name.trim(),
          type: categoryForm.value.type,
          user_id: user.id
        }])
        .select()

      if (error) throw error

      if (data && data.length > 0) {
        categories.value.push(data[0] as Category)
      } else {
        // Fallback se não conseguir obter o ID
        const newId = Math.max(...categories.value.map(c => c.id), 0) + 1
        categories.value.push({
          id: newId,
          name: categoryForm.value.name.trim(),
          type: categoryForm.value.type
        })
      }

      $q.notify({
        type: 'positive',
        message: 'Categoria criada com sucesso!',
        position: 'top'
      })
    }

    closeDialog()
  } catch (error) {
    console.error('Erro ao salvar categoria:', error)
    $q.notify({
      type: 'negative',
      message: 'Erro ao salvar categoria. Tente novamente.',
      position: 'top'
    })
  } finally {
    saving.value = false
  }
}

const confirmDelete = (category: Category) => {
  categoryToDelete.value = category
  showDeleteDialog.value = true
}

const deleteCategory = async () => {
  if (!categoryToDelete.value) return

  deleting.value = true

  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', categoryToDelete.value.id)

    if (error) throw error

    // Remover localmente
    categories.value = categories.value.filter(cat => cat.id !== categoryToDelete.value!.id)

    $q.notify({
      type: 'positive',
      message: 'Categoria excluída com sucesso!',
      position: 'top'
    })

    showDeleteDialog.value = false
    categoryToDelete.value = null
  } catch (error) {
    console.error('Erro ao excluir categoria:', error)
    $q.notify({
      type: 'negative',
      message: 'Erro ao excluir categoria. Verifique se não há transações vinculadas.',
      position: 'top'
    })
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  void loadCategories()
})
</script>

<style scoped>
.category-card {
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  background: white;
}

.category-item {
  transition: all 0.2s ease;
}

.category-item:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

/* Responsividade */
@media (max-width: 600px) {
  .row.q-gutter-md {
    flex-direction: column;
  }
  
  .row.q-gutter-md > * {
    margin-bottom: 8px;
    min-width: 100% !important;
  }
}
</style>